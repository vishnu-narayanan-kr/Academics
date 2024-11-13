package webCourseService;


public class Course {
    private String course_no;
    private String course_name;
    private int max_enrl;
    
    public static int credits = 3;

    Course() {
        this.course_no = "";
        this.course_name = "";
        this.max_enrl = 0;
    }
    
    Course(String course_no, String course_name, int max_enrl) {
        this.course_no = course_no;
        this.course_name = course_name;
        this.max_enrl = max_enrl;
    }
    
    public int CalculateTotalFees() {
    	return this.max_enrl * 250;
    }
    
    @Override
    public String toString() {
        return "Course Code: " + this.course_no + ", Course Name: " + this.course_name + "\nCredits: " + credits + ", Max enrolled: " + this.max_enrl + ", Course Fees: " + this.CalculateTotalFees() + "\n";
    }

    public String getCourse_no() {
        return course_no;
    }

    public void setCourse_no(String course_no) {
        this.course_no = course_no;
    }

    public String getCourse_name() {
        return course_name;
    }

    public void setCourse_name(String course_name) {
        this.course_name = course_name;
    }

    public int getMax_enrl() {
        return max_enrl;
    }

    public void setMax_enrl(int max_enrl) {
        this.max_enrl = max_enrl;
    }
}

