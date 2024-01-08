interface Base {
  find: (query?: { [key: string]: any }) => Base;
  limit: (num: number) => any;
  countDocuments: () => Promise<number>;
}

interface QueryParams {
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
}

interface Query {
  date?: {
    $gte: Date;
    $lte: Date;
  };
  category?: string;
}

type BigQ = QueryParams;
class WhereClause {
  base: Base;
  bigQ: BigQ;
  startIndex?: number;
  endIndex?: number;
  currentPage: number;
  resultPerPage: number;

  constructor(base: Base, bigQ: BigQ) {
    this.base = base;
    this.bigQ = bigQ;
    this.currentPage = 1;
    this.resultPerPage = 5;
  }

  search() {
    const searchTerm = this.bigQ?.search?.toLocaleLowerCase();
    const searchWord = searchTerm
      ? {
          category: {
            $regex: searchTerm,
            $options: "i",
          },
        }
      : {};

    this.base = this.base.find({ ...searchWord });

    return this;
  }

  filter() {
    const copyQ = { ...this.bigQ };

    const query: Query = {};

    delete copyQ["search"];
    delete copyQ["limit"];
    delete copyQ["page"];

    const { startDate, endDate, category } = copyQ;

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (category) {
      query.category = category;
    }

    this.base = this.base.find(query);

    return this;
  }

  pager() {
    const { limit, page } = this.bigQ;

    this.currentPage = Number(page) || 1;
    this.resultPerPage = Number(limit) || 5;

    this.startIndex = this.resultPerPage * (this.currentPage - 1);
    this.endIndex = this.currentPage * this.resultPerPage;

    this.base = this.base.limit(this.resultPerPage).skip(this.startIndex);

    return this;
  }
}

export { WhereClause };
