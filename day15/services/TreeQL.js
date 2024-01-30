const { QueryTypes } = require("sequelize");

module.exports = {
  parseRequestQuery(query) {
    const result = {};

    if (query.hasOwnProperty("filter")) {
      const queryFilterArr = Array.isArray(query.filter)
        ? query.filter
        : [query.filter];
      result.where = {};
      queryFilterArr.forEach((filterStr) => {
        const [field, operation, search] = filterStr.split(",");
        result.where[operation] = result.where[operation] || {};
        if (["bt", "nbt", "in", "nin"].includes(operation)) {
          const [, , ...values] = filterStr.split(",");
          result.where[operation][field] = values;
          return;
        }
        if (operation == "is") {
          const arr = result.where.is || [];
          arr.push(field);
          result.where.is = arr;
          return;
        }
        if (operation == "nis") {
          const arr = result.where.nis || [];
          arr.push(field);
          result.where.nis = arr;
          return;
        }

        result.where[operation][field] = search;
      });
    }

    if (query.hasOwnProperty("size")) {
      const querySizeString = Array.isArray(query.size)
        ? query.size[0]
        : query.size;
      const [limit, page] = querySizeString.split(",");
      result.limit = Number(limit) || 10;
      if (page) {
        result.offset = (Number(limit) - 1) * Number(page);
      }
    }

    if (query.hasOwnProperty("order")) {
      const queryOrderString = Array.isArray(query.order)
        ? query.order[0]
        : query.order;
      const [field, direction] = queryOrderString.split(",");
      result.order = field;
      result.direction = direction;
    }
    return result;
  },

  buildQuery(table, options) {
    let sql = "SELECT ";
    if (options.fields) {
      sql += `(${options.fields.join(",")}) FROM ${table}`;
    } else {
      sql += `* FROM ${table} `;
    }

    if (options.where) {
      const conditions = Object.entries(options.where).flatMap(
        ([operation, params]) => {
          if (operation == "cs") {
            return Object.entries(params).map(
              ([key, value]) => `${key} LIKE '%${value}%'`
            );
          }
          if (operation == "ncs") {
            return Object.entries(params).map(
              ([key, value]) => `${key} NOT LIKE '%${value}%'`
            );
          }
          if (operation == "sw") {
            return Object.entries(params).map(
              ([key, value]) => `${key} LIKE '${value}%'`
            );
          }
          if (operation == "nsw") {
            return Object.entries(params).map(
              ([key, value]) => `${key} NOT LIKE '${value}%'`
            );
          }
          if (operation == "ew") {
            return Object.entries(params).map(
              ([key, value]) => `${key} LIKE '%${value}'`
            );
          }
          if (operation == "new") {
            return Object.entries(params).map(
              ([key, value]) => `${key} NOT LIKE '%${value}'`
            );
          }
          if (operation == "is") {
            return params.map((key) => `${key} IS NULL`);
          }
          if (operation == "nis") {
            return params.map((key) => `${key} IS NOT NULL`);
          }
          if (operation == "ge" || operation == "nlt") {
            return Object.entries(params).map(
              ([key, value]) => `${key} >= ${value}`
            );
          }
          if (operation == "gt" || operation == "nle") {
            return Object.entries(params).map(
              ([key, value]) => `${key} > ${value}`
            );
          }
          if (operation == "lt" || operation == "nge") {
            return Object.entries(params).map(
              ([key, value]) => `${key} < ${value}`
            );
          }
          if (operation == "le" || operation == "ngt") {
            return Object.entries(params).map(
              ([key, value]) => `${key} <= ${value}`
            );
          }
          if (operation == "eq") {
            return Object.entries(params).map(
              ([key, value]) => `${key} = ${value}`
            );
          }
          if (operation == "neq") {
            return Object.entries(params).map(
              ([key, value]) => `${key} != ${value}`
            );
          }
          if (operation == "bt") {
            return Object.entries(params).map(([key, values]) => {
              const [a, b] = values;
              return `(${key} BETWEEN ${a} AND ${b})`;
            });
          }
          if (operation == "nbt") {
            return Object.entries(params).map(([key, values]) => {
              const [a, b] = values;
              return `(${key} NOT BETWEEN ${a} AND ${b})`;
            });
          }
          if (operation == "in") {
            return Object.entries(params).map(
              ([key, values]) => `${key} IN (${values.join(",")})`
            );
          }
          if (operation == "nin") {
            return Object.entries(params).map(
              ([key, values]) => `${key} NOT IN (${values.join(",")})`
            );
          }
          return null;
        }
      );

      sql += `WHERE ${conditions.filter((c) => c !== null).join(" AND ")} `;
    }

    if (options.order) {
      sql += `ORDER BY ${options.order} `;
    }

    if (options.order && options.direction) {
      sql += options.direction;
    }

    if (options.limit) {
      sql += `LIMIT ${options.limit} `;
    }

    if (options.offset) {
      sql += `OFFSET ${options.offset} `;
    }
    console.log("sql", sql);

    return sql;
  },

  async ListRecord(db, table, query) {
    const options = this.parseRequestQuery(query);
    const sql = this.buildQuery(table, options);

    return await db.sequelize.query(sql, { type: QueryTypes.SELECT });
  },

  async CreateRecord(db, table, payload) {
    return await db[table].create(payload);
  },

  async UpdateRecord(db, table, payload, id) {
    return await db[table].update(payload, { where: { id } });
  },

  async ReadRecord(db, table, id) {
    return await db[table].findByPk(id);
  },

  async PatchRecord(db, table, payload, id) {
    const record = await db[table].findByPk(id);
    return await record.increment(payload);
  },
  async DeleteRecord(db, table, id) {
    return await db[table].destroy({
      where: {
        id,
      },
    });
  },
};
