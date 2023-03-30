const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new Schema({
    name: String, // String is shorthand for {type: String}
    department: String,
    empId: String,
    phone: Number,
    email: {
        type: String,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email!`,
        }
    },
    password: { type: String, minLength: 6}
});

exports.Employee = mongoose.model('Employee', employeeSchema);