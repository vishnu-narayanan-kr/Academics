package webStudentFormREST;

public class Student {
    private int student_id;
    private String student_lname;
    private String student_fname;
    private int s_grade_assignment1;
    private int s_grade_assignment2;
    private int s_grade_assignment3;
    private int s_grade_midTerm;
    private int s_grade_finalTerm;
    private int faculty_id;

    Student() {
        this.student_id = 0;
        this.student_fname = "";
        this.student_lname = "";
        this.s_grade_assignment1 = 0;
        this.s_grade_assignment2 = 0;
        this.s_grade_assignment3 = 0;
        this.s_grade_midTerm = 0;
        this.s_grade_finalTerm = 0;
    }

    Student(int student_id, String student_lname, String student_fname, int s_grade_assignment1, int s_grade_assignment2, int s_grade_assignment3, int s_grade_midTerm, int s_grade_finalTerm, int faculty_id) {
        this.student_id = student_id;
        this.student_fname = student_fname;
        this.student_lname = student_lname;
        this.s_grade_assignment1 = s_grade_assignment1;
        this.s_grade_assignment2 = s_grade_assignment2;
        this.s_grade_assignment3 = s_grade_assignment3;
        this.s_grade_midTerm = s_grade_midTerm;
        this.s_grade_finalTerm = s_grade_finalTerm;
        this.faculty_id = faculty_id;
    }

    public int getStudent_id() {
        return student_id;
    }

    public void setStudent_id(int student_id) {
        this.student_id = student_id;
    }

    public String getStudent_lname() {
        return student_lname;
    }

    public void setStudent_lname(String student_lname) {
        this.student_lname = student_lname;
    }

    public String getStudent_fname() {
        return student_fname;
    }

    public void setStudent_fname(String student_fname) {
        this.student_fname = student_fname;
    }

    public int getS_grade_assignment1() {
        return s_grade_assignment1;
    }

    public void setS_grade_assignment1(int s_grade_assignment1) {
        this.s_grade_assignment1 = s_grade_assignment1;
    }

    public int getS_grade_assignment2() {
        return s_grade_assignment2;
    }

    public void setS_grade_assignment2(int s_grade_assignment2) {
        this.s_grade_assignment2 = s_grade_assignment2;
    }

    public int getS_grade_assignment3() {
        return s_grade_assignment3;
    }

    public void setS_grade_assignment3(int s_grade_assignment3) {
        this.s_grade_assignment3 = s_grade_assignment3;
    }

    public int getS_grade_midTerm() {
        return s_grade_midTerm;
    }

    public void setS_grade_midTerm(int s_grade_midTerm) {
        this.s_grade_midTerm = s_grade_midTerm;
    }

    public int getS_grade_finalTerm() {
        return s_grade_finalTerm;
    }

    public void setS_grade_finalTerm(int s_grade_finalTerm) {
        this.s_grade_finalTerm = s_grade_finalTerm;
    }

    public int getFaculty_id() {
		return faculty_id;
	}

	public void setFaculty_id(int faculty_id) {
		this.faculty_id = faculty_id;
	}

	public String toString() {
        return "S Id: " + this.student_id + ", S Lname: " + this.student_lname + ", S Fname: " + this.student_fname
                + ", S Ass1: " + this.s_grade_assignment1 + ", S Ass2: " + this.s_grade_assignment2 + ", S Ass3: " + this.s_grade_assignment3
                + ", S MT: " + this.s_grade_midTerm + ", S FT: " + this.s_grade_finalTerm + ", S faculty_id: " + this.faculty_id;
    }
    
    public double Calculate_GradeAverage() {
        double average = 0.4 * (this.s_grade_assignment1 + this.s_grade_assignment2 + this.s_grade_assignment3) / 3 + 0.3 * (this.s_grade_midTerm + this.s_grade_finalTerm);
        return Math.round(average * 100) / 100.0;
    }
}
