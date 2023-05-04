export default class APIFeatures {
    constructor(query, requestData, filter = {}) {
        this.query = query.find(filter);
        this.requestData = requestData;
    }

    filter() {
        const queryObj = { ...this.requestData };
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let where = JSON.parse(queryStr);
        where = Object.keys(where).length == 0 ? null : where;
        // console.log(where);
        if (where == null) {
            this.query.find();
        } else {
            this.query.find(where);
        }
        return this;
    }

    sort() {
        const sort = this.requestData.sort == null ? null : this.requestData.sort.split(",").join(" ");
        if (sort != null) {
            this.query.sort(sort);
        }
        return this;
    }

    limitedFields() {
        const fields = this.requestData.fields == null ? null : this.requestData.fields.split(",").join(" ");
        if (fields == null) {
            this.query.select("-__v");
        } else {
            this.query.select(fields);
        }
        return this;
    }

    pagination() {
        const page = this.requestData.page == null ? null : this.requestData.page * 1 || 1;
        const limit = this.requestData.limit == null ? null : this.requestData.limit * 1 || 10;
        const skip = limit * (page - 1);
        if (limit != null) {
            if (page == null) {
                this.query.limit(limit);
            } else {
                this.query.skip(skip).limit(limit);
            }
        }
        return this;
    }
    populate() {
        this.query.populate("reviews");
        return this;
    }

}