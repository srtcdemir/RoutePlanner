const {Int32} = require("mongodb");
module.exports = mongoose => {
    var stations_schema = mongoose.Schema(
        {
            name: String,
            latitude: String,
            longitude: String
        },
        {timestamps: true}
    );

    stations_schema.method("toJSON", function () {
        const {__v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });

    const stations = mongoose.model("stations", stations_schema);
    return stations;
};