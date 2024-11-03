package webFacultyREST;

public class Faculty {
    private int f_id;
    private String f_Lname;
    private String f_Fname;
    private String f_ZipCodeBirth;
    private double f_Salary;
    private double f_BonusRate;

    public Faculty(int f_id, String f_Lname, String f_Fname, String f_ZipCodeBirth, double f_Salary, double f_BonusRate) {
        this.f_id = f_id;
        this.f_Lname = f_Lname;
        this.f_Fname = f_Fname;
        this.f_ZipCodeBirth = f_ZipCodeBirth;
        this.f_Salary = f_Salary;
        this.f_BonusRate = f_BonusRate;
    }
    
    @Override
    public String toString() {
        String display = "[";
        
        display += "id: " + f_id + ", ";
        display += "lname: " + f_Lname + ", ";
        display += "fname: " + f_Fname + ", ";
        display += "fZipCodeBirth: " + f_ZipCodeBirth + ", ";
        display += "salary: " + f_Salary + "$, ";
        display += "bonus_rate: " + f_BonusRate + "%, ";
        display += "bonus: " + doCalc_Bonus() + "$, ";
        display += "bonus_tax: " + doBonus_tax() + "$";
        
        display += "]";
        
        return display;
    }
    
    public double doCalc_Bonus() {
        return Math.round(f_Salary * f_BonusRate) / 100.0;
    }
    
    public double doBonus_tax() {
        double f_tax = 0.075;
        double p_tax = 0.06;
        
        return Math.round((f_tax + p_tax) * doCalc_Bonus() * 100) / 100.0;
    }

    public int getF_id() {
        return f_id;
    }

    public void setF_id(int f_id) {
        this.f_id = f_id;
    }

    public String getF_Lname() {
        return f_Lname;
    }

    public void setF_Lname(String f_Lname) {
        this.f_Lname = f_Lname;
    }

    public String getF_Fname() {
        return f_Fname;
    }

    public void setF_Fname(String f_Fname) {
        this.f_Fname = f_Fname;
    }

    public String getF_ZipCodeBirth() {
		return f_ZipCodeBirth;
	}

	public void setF_ZipCodeBirth(String f_ZipCodeBirth) {
		this.f_ZipCodeBirth = f_ZipCodeBirth;
	}

	public double getF_Salary() {
        return f_Salary;
    }

    public void setF_Salary(double f_Salary) {
        this.f_Salary = f_Salary;
    }

    public double getF_BonusRate() {
        return f_BonusRate;
    }

    public void setF_BonusRate(double f_BonusRate) {
        this.f_BonusRate = f_BonusRate;
    }
}
