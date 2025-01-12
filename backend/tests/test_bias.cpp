#include <check.h>
#include "../src/bias.h"
#include "../src/user.h"
#include "../src/filters.h"

#include "test_bias.h"

// False Positive Rate calculation
START_TEST(test_calculateFilteredFalsePositiveRate) {
    // Test data
    std::vector<User> users = {
        {1, 30, "white", "north america", "male", 7.0, 720, false, false}, // True Negative
        {2, 25, "white", "north america", "female", 6.5, 580, false, false}, // False Positive
        {3, 35, "white", "north america", "male", 7.2, 500, true, true} // Not counted
    };

    // Filter configuration
    Filter filter("white", "", "north america", "adult");

    // Call the function to test
    double fpr = calculateFilteredFalsePositiveRate(users, filter);

    // Assertion
    ck_assert_double_eq_tol(fpr, 0.5, 0.01);
}
END_TEST

// Demographic Parity calculation
START_TEST(test_calculateFilteredDemographicParity) {
    std::vector<User> users = {
        {1, 30, "white", "north america", "male", 7.0, 720, false, true},
        {2, 25, "white", "north america", "female", 6.5, 580, false, true},
        {3, 35, "white", "north america", "male", 7.2, 800, true, true}
    };

    Filter filter("white", "", "north america", "adult");

    double parity = calculateFilteredDemographicParity(users, filter);
    ck_assert_double_eq_tol(parity, 0.666, 0.01); // 2/3 approvals
}
END_TEST

// Group Disparity calculation
START_TEST(test_calculateGroupDisparity) {
    std::vector<User> users = {
        {1, 30, "white", "north america", "male", 7.0, 720, false, true}, // Group
        {2, 25, "white", "north america", "female", 6.5, 580, false, true}, // Group
        {3, 35, "asian", "north america", "male", 7.2, 800, true, true}, // Others
        {4, 40, "black", "north america", "female", 7.8, 750, false, true} // Others
    };

    // Filter for the specific group
    Filter groupFilter("white", "", "north america", "");

    // Call the function to test
    double disparity = calculateGroupDisparity(users, groupFilter);

    // The average credit score of "white" users: (720 + 580) / 2 = 650
    // The average credit score of others: (800 + 750) / 2 = 775
    // Expected disparity: 650 / 775 ≈ 0.839
    ck_assert_double_eq_tol(disparity, 0.839, 0.01);
}
END_TEST

Suite *metrics_suite(void) {
    Suite *s = suite_create("Metrics");
    TCase *tc_core = tcase_create("Core");

    tcase_add_test(tc_core, test_calculateFilteredFalsePositiveRate);
    tcase_add_test(tc_core, test_calculateFilteredDemographicParity);
    tcase_add_test(tc_core, test_calculateGroupDisparity);

    suite_add_tcase(s, tc_core);
    return s;
}
