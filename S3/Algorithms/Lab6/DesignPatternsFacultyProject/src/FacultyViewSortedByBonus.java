
import java.util.Map;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author Dell
 */
public class FacultyViewSortedByBonus implements View {

    @Override
    public void print(Map<Integer, Faculty> map) {
        System.out.println("Printing facutly keys sorted by doCalc_Bonus()");
            map
            .values()
            .stream()
            .sorted((f1, f2) -> Double.compare(f1.doCalc_Bonus(), f2.doCalc_Bonus()))
            .forEach(f -> System.out.println(f.getF_id()));
        
        System.out.println("Printing facutly values sorted by doCalc_Bonus()");
            map
            .values()
            .stream()
            .sorted((f1, f2) -> Double.compare(f1.doCalc_Bonus(), f2.doCalc_Bonus()))
            .forEach(System.out::println);
    }
    
}
