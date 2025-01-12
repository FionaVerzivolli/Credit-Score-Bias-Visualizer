#ifndef FILTERS_H
#define FILTERS_H

#include <string>
#include "user.h"

// filter structure
struct Filter {
    std::string race;
    std::string gender;
    std::string continent;
    std::string age;

    Filter(std::string r = "", std::string g = "", std::string c = "", std::string a = "")
        : race(r), gender(g), continent(c), age(a) {}
};

// function declaration
bool userMatchesFilters(const User& user, const Filter& filter);

#endif
