
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Scanner;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author Dell
 */
public class TestFacultyDesignPatterns {

    public static void main(String[] args) {
        Map<Integer, Faculty> model = FacultySingleton.getInstance().getFacultyHashMap();
        View view = new FacultyView();

        FacultyController facultyController = new FacultyController(model, view);
        facultyController.printView();

        System.out.println("\nDisplaying sorted LinkedHashMap by updating to a new Data model");
        Map<Integer, Faculty> sortedModelCalcBonus = getSortedModelCalcBonus(model);
        facultyController.updateModel(sortedModelCalcBonus);
        facultyController.printView();

        System.out.println("\nDisplaying sorted HashMap data by updating to a new View model");
        View facultyViewSortedByBonus = new FacultyViewSortedByBonus();
        facultyController.updateModel(model);
        facultyController.setView(facultyViewSortedByBonus);
        facultyController.printView();

        System.out.println("\nTraversing Faculty HashMap using RateIterator");
        FacultyRepository facultyRepository = new FacultyRepository(model);
        FacultyView iteratorView = new FacultyView();

        Scanner scanner = new Scanner(System.in);

        System.out.println("Enter a faculty rate to traverse: ");
        Double rate = scanner.nextDouble();

        for (Iterator it = facultyRepository.getFacultyRateIterator(rate); it.hasNext();) {
            iteratorView.print(it.next());
        }
        
        
        System.out.println("\nTraversing Faculty HashMap using SalaryIteratory");
        for (Iterator it = facultyRepository.getFacultySalaryIterator(); it.hasNext();) {
            iteratorView.print(it.next());
        }
    }

    private static LinkedHashMap<Integer, Faculty> getSortedModelCalcBonus(Map<Integer, Faculty> map) {
        LinkedHashMap<Integer, Faculty> sortedModelCalcBonus = new LinkedHashMap();

        map
                .values()
                .stream()
                .sorted((f1, f2) -> Double.compare(f1.doCalc_Bonus(), f2.doCalc_Bonus()))
                .forEach(f -> sortedModelCalcBonus.put(f.getF_id(), f));

        return sortedModelCalcBonus;
    }
}
