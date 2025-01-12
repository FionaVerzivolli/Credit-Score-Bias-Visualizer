#include "filters.h"

// check if a user matches the provided filters
bool userMatchesFilters(const User& user, const Filter& filters) {
    if (!filters.race.empty() && user.race != filters.race) return false;
    if (!filters.gender.empty() && user.gender != filters.gender) return false;
    if (!filters.continent.empty() && user.continent != filters.continent) return false;
    if (!filters.age.empty() && user.age != filters.age) return false;
    return true;
}
