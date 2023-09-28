const db = require('../models')
const uploadFile = require("../middleware/upload")
const Student = db.students
const fs = require("fs")

exports.create = (req, res) => {
try {
    uploadFile(req, res, err => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (!req.file) {
            const errorMessage = {
            message: 'Please select a file to upload'
            };
            return res.status(400).json(errorMessage);
        }
        //const url = req.protocol + '://' + req.get('host')
        const newStudent = new Student(
        {
            code: req.body.code,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            profileImage: req.file ? req.file.filename : null
        }
        );
        //console.log(req.file.size)

        newStudent.save()
        //.then(data => res.json({message: 'File uploaded successfully'}))
        .then(res.json({message: 'File uploaded successfully'}))
        .catch(err => res.status(500).json({ error: err }));
    })
    .catch(err => res.status(500).json({ error: err }));
  //
 
  } catch (err) {
    console.log(err);
  }
}

exports.findAll = async (req, res) => {
    const { firstname, page = 1, limit = 5 } = req.query;
    var condition = firstname ? { firstname : { $regex: new RegExp(firstname), $options: "i" } } : {};
    try{
        const count = await Student.countDocuments(condition);
        const totalPages = Math.ceil(count / limit);
        Student.find(condition)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .then(students => {
            //res.json({students})
            res.json({ data: students, totalPages });
        })
        .catch(err =>{
            res.status(500)
                .json({ message: err.message || "Some error occurred while creating the student." })
        })
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

exports.findOne = (req, res) => {
    const id = req.params.id

    Student.findById(id)
    .then(data => {
        if(!data){
            res.status(404).json({message:"Not found!"})
        }
        else{
            res.json(data)
        }
    })
    .catch(err => {
        res.status(500).json({message: "Error retrieving data!"})
    })
}

exports.update = async (req, res) => {
    uploadFile(req, res, err => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        Student.findById(req.params.id)
            .then(student => {
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }
            const updateFields = {
                code: req.body.code || student.code,
                firstname: req.body.firstname || student.firstname,
                lastname: req.body.lastname || student.lastname,
                email: req.body.email || student.email,
                profileImage: student.profileImage,
            };

            if (req.file) {
                if (student.profileImage) {
                    fs.unlinkSync(__basedir + `/resources/static/assets/uploads/${student.profileImage}`);
                }
                updateFields.profileImage = req.file.filename;
            } else if (req.body.removeProfileImage) {
                // Remove the profile image if requested
                if (student.profileImage) {
                    fs.unlinkSync(__basedir + `/resources/static/assets/uploads/${student.profileImage}`);
                }
                updateFields.profileImage = null;
            }
            Student.findByIdAndUpdate(req.params.id, updateFields, { new: true })
                //.then(updatedStudent => res.json(updatedStudent))
                .then(res.json({message : 'File updated successfully'}))
                .catch(err => res.status(500).json({ error: err })
            );
        })
        .catch(err => res.status(500).json({ error: err }));
    });
}

exports.delete = async (req, res) => {
    Student.findByIdAndDelete(req.params.id)
        .then(deletedStudent => {
            if (!deletedStudent) {
                return res.status(404).json({ message: 'Student not found' });
            }
        // Remove the profile image if there is one
        if (deletedStudent.profileImage) {
            fs.unlinkSync(__basedir + `/resources/static/assets/uploads/${deletedStudent.profileImage}`);
        }
            
            res.json({ message: 'Student deleted successfully' });
        })
        .catch(err => res.status(500).json({ error: err })
    );
}