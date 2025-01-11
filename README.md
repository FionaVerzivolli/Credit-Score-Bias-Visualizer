# Bias Detection Project

This project aims to analyze and detect potential biases in credit scoring systems using a custom dataset and an implementation in C++ for the backend, alongside other tools for visualization and analysis.

---

## **Purpose**

The project is designed to:
1. Evaluate fairness in credit scoring systems by analyzing demographic data.
2. Detect biases such as:
   - Disparate Impact.
   - False Positive Rates across groups.
   - Demographic Parity.
3. Provide a modular structure for integrating custom datasets and extending functionality.

---


---

## **Project Components**

### **1. Backend Logic**
#### **Files**: `user.h`, `userlist.h`, `bias.cpp`
- **User Class** (`user.h`): Represents an individual entry with attributes like race, gender, economic situation, and credit score.
- **UserList Class** (`userlist.h`): Manages and processes multiple `User` objects.
- **Bias Calculations** (`bias.cpp`): Implements algorithms to:
  - Calculate False Positive Rate (FPR).
  - Evaluate demographic parity.
  - Identify communities with lower average credit scores.

### **2. Dataset**
#### **File**: `custom_large_dataset.json`
- JSON file containing 50+ entries with attributes for each user.
- Used for testing and evaluating the bias detection algorithms.

### **3. Metrics**
The project evaluates the following fairness metrics:
- **False Positive Rate (FPR)**: Proportion of non-defaulting individuals incorrectly flagged as risky.
- **Demographic Parity**: Approval rates across demographic groups.
- **Group Disparity**: Average credit scores between advantaged and disadvantaged groups.

---

## **Usage**

1. **Modify the Dataset**:
   - Update `custom_large_dataset.json` with your own data if needed.
2. **Extend the Metrics**:
   - Add new bias detection metrics in `bias.cpp`.
3. **Visualize Results**:
   - Use additional tools (e.g., Python, Excel) to analyze outputs if desired.

---

## **Example Execution**

After running the program, the output will include metrics such as:
- False Positive Rate for each demographic group.
- Average credit scores by race, gender, and region.
- Overall bias evaluation, including a letter grade.

Example output:

```
False Positive Rate (Black): 0.333
Group Disparity (Black vs White): 0.87
Letter Grade: B
```

---

## **Acknowledgments**

This project is for educational and testing purposes only. All datasets are synthetic and do not represent real-world individuals.

---

## **License**
This project is distributed under the MIT License. You are free to use, modify, and distribute it for educational and non-commercial purposes.

