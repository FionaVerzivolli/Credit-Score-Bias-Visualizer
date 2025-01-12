#include <iostream>
#include "filters.h"

// check if a user matches the provided filters
bool userMatchesFilters(const User& user, const Filter& filter) {
    if (!filter.race.empty() && user.race != filter.race) {
        std::cout << "Filter Mismatch: Race (Expected: " << filter.race
                  << ", Got: " << user.race << ")\n";
        return false;
    }
    if (!filter.gender.empty() && user.gender != filter.gender) {
        std::cout << "Filter Mismatch: Gender (Expected: " << filter.gender
                  << ", Got: " << user.gender << ")\n";
        return false;
    }
    if (!filter.continent.empty() && user.continent != filter.continent) {
        std::cout << "Filter Mismatch: Continent (Expected: " << filter.continent
                  << ", Got: " << user.continent << ")\n";
        return false;
    }
    if (!filter.age.empty() && user.age != filter.age) {
        std::cout << "Filter Mismatch: Age (Expected: " << filter.age
                  << ", Got: " << user.age << ")\n";
        return false;
    }
    return true;
}

