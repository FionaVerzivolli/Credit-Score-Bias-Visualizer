#include <stdlib.h>
#include <check.h>
#include "test_filters.h"
#include "test_bias.h"

// run this file to run the tests
int main(void) {
    int number_failed;
    SRunner *sr;

    sr = srunner_create(filters_suite());
    srunner_add_suite(sr, metrics_suite());

    srunner_run_all(sr, CK_NORMAL);
    number_failed = srunner_ntests_failed(sr);
    srunner_free(sr);

    return (number_failed == 0) ? EXIT_SUCCESS : EXIT_FAILURE;
}
