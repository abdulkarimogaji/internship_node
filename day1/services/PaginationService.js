module.exports = {
  parseQuery: (query) => {
    const result = { limit: 5, offset: 0, order: [["id", "DESC"]] };
    if (query.hasOwnProperty("limit")) {
      const limit = Array.isArray(query.limit) ? query.limit[0] : query.limit;
      result.limit = Number(limit) || 5;
    }
    if (query.hasOwnProperty("page") && result.limit > 0 && query.page > 0) {
      const page = Array.isArray(query.page) ? query.page[0] : query.page;
      result.offset = (Number(limit) - 1) * Number(page);
    }
    if (query.hasOwnProperty("sort")) {
      const sortArr = Array.isArray(query.sort) ? query.sort : [query.sort];
      result.order = sortArr.map((field) => {
        const direction = Array.isArray(query.direction)
          ? query.direction[0]
          : query.direction;
        return [field, direction];
      });
    }
    return result;
  },

  getPageData: (totalCount, list, limit, offset) => {
    return {
      total: totalCount,
      list: list,
      limit: limit,
      page: Math.floor(offset / limit) + 1,
      num_pages: Math.ceil(totalCount / limit),
    };
  },
};
