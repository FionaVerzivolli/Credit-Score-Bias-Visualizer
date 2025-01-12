#include <check.h>
#include "../src/filters.h"
#include "../src/user.h"
#include "test_filters.h"

// user matches all filter criteria
START_TEST(test_userMatchesFilters_all_criteria) {
    User user(1, 34, "white", "north america", "male", 5.0, 400, false, false);
    Filter filter("white", "male", "north america", "adult");

    ck_assert(userMatchesFilters(user, filter));
}
END_TEST

// user does not match race filter
START_TEST(test_userMatchesFilters_race_mismatch) {
    User user(1, 34, "asian", "north america", "male", 5.0, 400, false, false);
    Filter filter("white", "male", "north america", "adult");

    ck_assert(!userMatchesFilters(user, filter));
}
END_TEST

Suite *filters_suite(void) {
    Suite *s = suite_create("Filters");
    TCase *tc_core = tcase_create("Core");

    tcase_add_test(tc_core, test_userMatchesFilters_all_criteria);
    tcase_add_test(tc_core, test_userMatchesFilters_race_mismatch);

    suite_add_tcase(s, tc_core);
    return s;
}
