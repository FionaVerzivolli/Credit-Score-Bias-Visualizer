#ifndef FILTERS_H
#define FILTERS_H

#include <string>
#include "user.h" // include User struct from user.h

// filter structure
struct Filter {
    std::string race = "";
    std::string gender = "";
    std::string continent = "";
    std::string age = "";
};

// function declaration
bool userMatchesFilters(const User& user, const Filter& filters);

#endif
