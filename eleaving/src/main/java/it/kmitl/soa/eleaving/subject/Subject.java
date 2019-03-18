package it.kmitl.soa.eleaving.subject;

public class Subject {

    private String studentId;
    private String subjectId;
    private String subjectName;
    private String section;
    private String professor;

    public Subject() {
    }

    public Subject(String studentId, String subjectId, String subjectName, String section, String professor) {
        this.studentId = studentId;
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.section = section;
        this.professor = professor;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getProfessor() {
        return professor;
    }

    public void setProfessor(String professor) {
        this.professor = professor;
    }
}
