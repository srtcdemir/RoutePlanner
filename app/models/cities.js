const {Int32} = require("mongodb");
module.exports = mongoose => {
    var cities_schema = mongoose.Schema(
        {
            plaka: Number,
            il_adi: String,
            lat: Number,
            lon: Number
        },
        {timestamps: true}
    );

    cities_schema.method("toJSON", function () {
        const {__v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });

    const cities = mongoose.model("cities", cities_schema);
    return cities;
};