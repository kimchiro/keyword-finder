const axios = require("axios");
const NaverApiDao = require("../dao/NaverApiDao");

class NaverApiService {
  constructor() {
    this.naverApiDao = NaverApiDao;
    this.clientId = process.env.NAVER_CLIENT_ID;
    this.clientSecret = process.env.NAVER_CLIENT_SECRET;

    // API 호출 제한 관리
    this.dailyApiCount = 0;
    this.lastResetDate = new Date().toDateString();
    this.analysisCache = new Map();
    this.CACHE_DURATION = 60 * 60 * 1000; // 1시간
  }

  /**
   * API 키 검증
   */
  validateApiKeys() {
    if (!this.clientId || !this.clientSecret) {
      throw new Error("네이버 API 키가 설정되지 않았습니다.");
    }
  }

  /**
   * 일일 API 카운터 리셋
   */
  resetDailyCountIfNeeded() {
    const today = new Date().toDateString();
    if (this.lastResetDate !== today) {
      this.dailyApiCount = 0;
      this.lastResetDate = today;
      console.log(`🔄 일일 API 카운터 리셋: ${today}`);
    }
  }

  // ========== 네이버 검색 API ==========

  /**
   * 네이버 블로그 검색
   */
  async searchBlog(query, options = {}) {
    try {
      this.validateApiKeys();

      const { display = 10, start = 1, sort = "sim" } = options;
      const encodeQuery = encodeURIComponent(query);

      const response = await axios.get(
        `https://openapi.naver.com/v1/search/blog.json?query=${encodeQuery}&display=${display}&start=${start}&sort=${sort}`,
        {
          headers: {
            "X-Naver-Client-Id": this.clientId,
            "X-Naver-Client-Secret": this.clientSecret,
          },
        }
      );

      // DB에 검색 결과 저장
      if (response.data && response.data.items) {
        await this.naverApiDao.saveSearchResults(query, response.data.items);
      }

      return {
        success: true,
        data: response.data,
        query: query,
        savedToDb: true,
      };
    } catch (error) {
      console.error("❌ NaverApiService.searchBlog 오류:", error);
      throw new Error(
        error.response?.data?.errorMessage ||
          "네이버 검색 API 호출 중 오류가 발생했습니다."
      );
    }
  }

  // ========== 네이버 데이터랩 API ==========

  /**
   * 네이버 데이터랩 통합검색어 트렌드
   */
  async getDatalabTrends(requestData) {
    try {
      this.validateApiKeys();

      const {
        startDate,
        endDate,
        timeUnit = "month",
        keywordGroups,
        device = "",
        gender = "",
        ages = [],
      } = requestData;

      const requestBody = {
        startDate,
        endDate,
        timeUnit,
        keywordGroups,
        device,
        gender,
        ages,
      };

      const response = await axios.post(
        "https://openapi.naver.com/v1/datalab/search",
        requestBody,
        {
          headers: {
            "X-Naver-Client-Id": this.clientId,
            "X-Naver-Client-Secret": this.clientSecret,
            "Content-Type": "application/json",
          },
        }
      );

      // DB에 트렌드 데이터 저장
      if (response.data && response.data.results) {
        for (const result of response.data.results) {
          const query = result.title;
          await this.naverApiDao.saveDatalabTrends(query, result.data, {
            device,
            gender,
            ageGroup: ages.join(","),
          });
        }
      }

      return {
        success: true,
        data: response.data,
        savedToDb: true,
      };
    } catch (error) {
      console.error("❌ NaverApiService.getDatalabTrends 오류:", error);
      throw new Error(
        error.response?.data?.errorMessage ||
          "네이버 데이터랩 API 호출 중 오류가 발생했습니다."
      );
    }
  }

  // ========== 네이버 검색광고 키워드 도구 API ==========

  /**
   * 연관 키워드 조회
   */
  async getRelatedKeywords(keyword) {
    try {
      this.validateApiKeys();

      const response = await axios.get(
        `https://openapi.naver.com/v1/searchad/keywordstool?hintKeywords=${encodeURIComponent(
          keyword
        )}&showDetail=1`,
        {
          headers: {
            "X-Naver-Client-Id": this.clientId,
            "X-Naver-Client-Secret": this.clientSecret,
          },
        }
      );

      // DB에 연관 키워드 저장
      if (response.data && response.data.keywordList) {
        await this.naverApiDao.saveRelatedKeywords(
          keyword,
          response.data.keywordList
        );
      }

      return {
        success: true,
        data: response.data,
        savedToDb: true,
      };
    } catch (error) {
      console.error("❌ NaverApiService.getRelatedKeywords 오류:", error);
      throw new Error(
        error.response?.data?.errorMessage ||
          "네이버 키워드 도구 API 호출 중 오류가 발생했습니다."
      );
    }
  }

  // ========== 종합 분석 ==========

  /**
   * 키워드 종합 분석 (모든 API 데이터 통합)
   */
  async comprehensiveAnalysis(keyword) {
    try {
      this.resetDailyCountIfNeeded();

      // DB 캐시 확인
      const cachedData = await this.naverApiDao.getComprehensiveAnalysis(
        keyword
      );
      if (cachedData) {
        console.log(`✅ DB 캐시에서 반환: ${keyword}`);
        return {
          success: true,
          data: cachedData,
          cached: true,
          cacheSource: "database",
        };
      }

      // 메모리 캐시 확인
      const cacheKey = `analysis_${keyword.toLowerCase().trim()}`;
      const memoryCachedData = this.analysisCache.get(cacheKey);
      if (
        memoryCachedData &&
        Date.now() - memoryCachedData.timestamp < this.CACHE_DURATION
      ) {
        console.log(`✅ 메모리 캐시에서 반환: ${keyword}`);
        return {
          success: true,
          data: memoryCachedData.data,
          cached: true,
          cacheSource: "memory",
        };
      }

      this.validateApiKeys();

      // 병렬로 여러 API 호출
      const promises = [];
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);

      // 1. 연관 키워드
      promises.push(
        this.getRelatedKeywords(keyword).catch((err) => ({
          error: err,
          type: "related",
        }))
      );

      // 2. 기본 검색 트렌드
      promises.push(
        this.getDatalabTrends({
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          timeUnit: "month",
          keywordGroups: [{ groupName: keyword, keywords: [keyword] }],
        }).catch((err) => ({ error: err, type: "trend" }))
      );

      // 3. 성별 분석
      promises.push(
        this.getDatalabTrends({
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          timeUnit: "month",
          keywordGroups: [{ groupName: keyword, keywords: [keyword] }],
          gender: "m",
        }).catch((err) => ({ error: err, type: "gender_m" }))
      );

      promises.push(
        this.getDatalabTrends({
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          timeUnit: "month",
          keywordGroups: [{ groupName: keyword, keywords: [keyword] }],
          gender: "f",
        }).catch((err) => ({ error: err, type: "gender_f" }))
      );

      const results = await Promise.allSettled(promises);

      // 결과 처리
      const analysisResult = {
        keyword,
        relatedKeywords: [],
        searchTrend: null,
        genderAnalysis: { male: null, female: null },
        generatedAt: new Date().toISOString(),
      };

      results.forEach((result, index) => {
        if (
          result.status === "fulfilled" &&
          result.value &&
          !result.value.error
        ) {
          const data = result.value.data;
          switch (index) {
            case 0: // 연관 키워드
              analysisResult.relatedKeywords = data.keywordList || [];
              break;
            case 1: // 기본 트렌드
              analysisResult.searchTrend = data.results?.[0] || null;
              break;
            case 2: // 남성 트렌드
              analysisResult.genderAnalysis.male = data.results?.[0] || null;
              break;
            case 3: // 여성 트렌드
              analysisResult.genderAnalysis.female = data.results?.[0] || null;
              break;
          }
        }
      });

      // DB에 분석 결과 저장
      await this.naverApiDao.saveComprehensiveAnalysis(keyword, analysisResult);

      // 메모리 캐시에 저장
      this.analysisCache.set(cacheKey, {
        data: analysisResult,
        timestamp: Date.now(),
      });

      this.dailyApiCount += promises.length;
      console.log(
        `✅ 키워드 종합 분석 완료: ${keyword} (일일 사용량: ${this.dailyApiCount})`
      );

      return {
        success: true,
        data: analysisResult,
        cached: false,
        dailyUsage: this.dailyApiCount,
      };
    } catch (error) {
      console.error("❌ NaverApiService.comprehensiveAnalysis 오류:", error);
      throw error;
    }
  }

  // ========== DB 조회 메서드 ==========

  /**
   * DB에서 검색 결과 조회
   */
  async getStoredSearchResults(query, limit = 10) {
    try {
      const results = await this.naverApiDao.getSearchResults(query, limit);
      return {
        success: true,
        data: {
          query,
          items: results,
          total: results.length,
        },
      };
    } catch (error) {
      console.error("❌ NaverApiService.getStoredSearchResults 오류:", error);
      throw error;
    }
  }

  /**
   * DB에서 트렌드 데이터 조회
   */
  async getStoredTrendData(query, options = {}) {
    try {
      const trendData = await this.naverApiDao.getDatalabTrends(query, options);
      return {
        success: true,
        data: {
          query,
          results: [
            {
              title: query,
              keywords: [query],
              data: trendData.map((item) => ({
                period: item.period,
                ratio: item.ratio,
              })),
            },
          ],
        },
      };
    } catch (error) {
      console.error("❌ NaverApiService.getStoredTrendData 오류:", error);
      throw error;
    }
  }

  /**
   * 통합 키워드 데이터 조회
   */
  async getIntegratedData(query) {
    try {
      const integratedData = await this.naverApiDao.getIntegratedKeywordData(
        query
      );
      return {
        success: true,
        data: integratedData,
      };
    } catch (error) {
      console.error("❌ NaverApiService.getIntegratedData 오류:", error);
      throw error;
    }
  }
}

module.exports = new NaverApiService();
