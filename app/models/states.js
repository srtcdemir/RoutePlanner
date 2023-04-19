const {Int32} = require("mongodb");
module.exports = mongoose => {
    var states_schema = mongoose.Schema(
        {
            ilce_id: Number,
            il_plaka: Number,
            ilce_adi: String,
            lat: Number,
            lon: Number
        },
        {timestamps: true}
    );

    states_schema.method("toJSON", function () {
        const {__v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });

    const states = mongoose.model("states", states_schema);
    return states;
};