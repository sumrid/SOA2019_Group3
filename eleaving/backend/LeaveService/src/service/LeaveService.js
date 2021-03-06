const MySQL = require('mysql')
const fs = require('fs')
const path = require('path')
const _ = require('underscore');

const HOST_MYSQL = '35.240.188.199'
const PORT_MYSQL = '3310'

// Connect Database
var connect = MySQL.createConnection({
    host: HOST_MYSQL,
    port: PORT_MYSQL,
    user: 'root',
    password: 'soaeleaving',
    database: 'leavedatabase'
})

console.log(`[Leave Service] Connected to Mysql -> ${HOST_MYSQL}:${PORT_MYSQL}`);
connect.connect();

exports.getAllLeavedocument = (req, res) => {
    connect.query('select * from document join document_subject on (document.document_id = document_subject.document_id) Order by document_date DESC', function (err, results, fields) {
        if (results.length) {
            console.log('GET DATA COMPLETE')
            return res.status(200).json(results)
        } else {
            return res.status(404).json(err)
        }
    })
}

exports.getLeavedocumentById = (req, res) => {
    var documentid = req.params.leaveid

    connect.query('select * from document join document_subject on (document.document_id = document_subject.document_id) \
    where document.document_id = ?', [documentid], function (err, results, fields) {
            if (results.length) {
                console.log('GET DATA COMPLETE')
                return res.status(200).json(results)
            } else {
                return res.status(404).json(err)
            }
        })
}

exports.getStatus = (req, res) => {
    var userid = req.params.userid

    var sqlQueryStatus = `select document.document_id, document.document_date, document.comment, document_subject.subject_name, document_subject.status from document join document_subject on (document.document_id = document_subject.document_id)
    where account_id = ? order by document.document_date DESC`

    connect.query(sqlQueryStatus, [userid], function (err, results, fields) {
        if (results.length) {
            return res.status(200).json(results)
        } else {
            return res.status(400).json(err)
        }
    })
}

exports.getNumberSubjectLeave = (req, res) => {
    var userid = req.params.userid

    var sqlQuerySubjectCount = `select subject_name, count(*) as count, account_id from document_subject join document
    on (document_subject.document_id = document.document_id) where status = 'อนุมัติ' group by subject_name having account_id = ?`

    connect.query(sqlQuerySubjectCount, [userid], function (err, results, fields) {
        if (results.length) {
            return res.status(200).json(results)
        } else {
            return res.status(400).json(err)
        }
    })
}

exports.viewPDF = (req, res) => {
    var filename = req.params.filename
    var filepath = '/src/controller/uploads/' + filename

    console.log(path.resolve(filepath))

    fs.readFile(filepath, function (err, data) {
        res.contentType("application/pdf");
        res.status(200).send(data);
    })
}

exports.updateStatus = (req, res) => {
    var status = req.body.status
    var documentId = req.body.documentId
    var docSubjectId = req.body.documentSubjectId

    if(status == "accept") {
        var sqlUpdateStatus = `update document_subject set status = 'อนุมัติ' where document_id = ? and doc_subject_id = ?`
        connect.query(sqlUpdateStatus, [documentId, docSubjectId], function(err,results,fields) {
            if(results) {
                return res.status(200).json({messageAlert: "ดำเนินการเรียบร้อย"})
            } else {
                return res.status(400).json({messageAlert: "เกิดข้อผิดพลาด"})
            }
        })
    } else {
        var sqlUpdateStatus = `update document_subject set status = 'ไม่อนุมัติ' where document_id = ? and doc_subject_id = ?`
        connect.query(sqlUpdateStatus, [documentId, docSubjectId], function(err,results,fields) {
            if(!err) {
                return res.status(200).json({messageAlert: "ดำเนินการเรียบร้อย"})
            } else {
                return res.status(400)
            }
        })
    }
}

exports.postNewSickLeavedocument = (req, res) => {
    // Document
    var document = JSON.parse(req.body.document);
    var documentid = document.document_id;
    var documentdate = document.document_date;
    var documentcatalog = document.document_catalog;
    var firstname = document.firstname;
    var lastname = document.lastname;
    var studentid = document.student_id;
    var studentterm = document.student_term;
    var schoolyear = document.school_year;
    var studentgeneration = document.student_generation;
    var studentbranch = document.student_branch;
    var studentdegree = document.student_degree;
    var comment = document.comment;
    var filepath = req.file.filename;
    var since = document.since;
    var to = document.to;
    var total = document.total;
    var accountid = document.account_id;

    // Document Subject
    var status = "รออนุมัติ";
    var subjectname = JSON.parse(req.body.document_subject);
    var documentSubjectValue = []
    for (var subjectIndex in subjectname) {
        documentSubjectValue.push(
            [documentid, subjectname[subjectIndex].subjectList, status]
        )
    }

    var sqlDocumentInsert = `INSERT INTO 
        document (document_id, document_date, document_catalog, firstname, lastname, student_id, 
            student_term, school_year, student_generation, student_branch, student_degree, comment, filepath, 
            since, document.to, total, account_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connect.query(sqlDocumentInsert, [documentid, documentdate, documentcatalog,
        firstname, lastname, studentid, studentterm, schoolyear, studentgeneration,
        studentbranch, studentdegree, comment, filepath, since, to, total, accountid], function (err, results, fields) {
            if (!err) {
                console.log('INSERT DOCUMENT IS OK')

                var sqlDocumentSubjectInsert = `insert into document_subject (document_id, subject_name, status) VALUES ?`;
                connect.query(sqlDocumentSubjectInsert, [documentSubjectValue], function (err, results) {
                    if (!err) {
                        console.log('INSERT DOCUMENT SUBJECT IS OK')
                        return res.status(200).json({ success: "ส่งใบลาสำเร็จ" })
                    } else {
                        return res.status(400)
                    }
                })
            } else {
                return res.status(400)
            }
        })
}

exports.postNewPersonalLeavedocument = (req, res) => {
    // Document
    var document = JSON.parse(req.body.document);
    var documentid = document.document_id;
    var documentdate = document.document_date;
    var documentcatalog = document.document_catalog;
    var firstname = document.firstname;
    var lastname = document.lastname;
    var studentid = document.student_id;
    var studentterm = document.student_term;
    var schoolyear = document.school_year;
    var studentgeneration = document.student_generation;
    var studentbranch = document.student_branch;
    var studentdegree = document.student_degree;
    var comment = document.comment;
    var filepath = req.file.filename;
    var since = document.since;
    var to = document.to;
    var total = document.total;
    var accountid = document.account_id;

    // Document Subject
    var status = "รออนุมัติ";
    var subjectname = JSON.parse(req.body.document_subject);
    var documentSubjectValue = []
    for (var subjectIndex in subjectname) {
        documentSubjectValue.push(
            [documentid, subjectname[subjectIndex].subjectList, status]
        )
    }

    var sqlDocumentInsert = `INSERT INTO 
        document (document_id, document_date, document_catalog, firstname, lastname, student_id, 
            student_term, school_year, student_generation, student_branch, student_degree, comment, filepath, 
            since, document.to, total, account_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connect.query(sqlDocumentInsert, [documentid, documentdate, documentcatalog,
        firstname, lastname, studentid, studentterm, schoolyear, studentgeneration,
        studentbranch, studentdegree, comment, filepath, since, to, total, accountid], function (err, results, fields) {
            if (!err) {
                console.log('INSERT DOCUMENT IS OK')

                var sqlDocumentSubjectInsert = `insert into document_subject (document_id, subject_name, status) VALUES ?`;
                connect.query(sqlDocumentSubjectInsert, [documentSubjectValue], function (err, results) {
                    if (!err) {
                        console.log('INSERT DOCUMENT SUBJECT IS OK')
                        return res.status(200).json({ success: "ส่งใบลาสำเร็จ" })
                    } else {
                        return res.status(400)
                    }
                })
            } else {
                return res.status(400)
            }
        })
}