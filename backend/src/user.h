#ifndef USER_H
#define USER_H

/*
User class generated per database row
Contains all the important information
*/

#include <string>

class User {
public:
    int user_id;
    std::string age; // changed from int to string to hold the category
    std::string race;
    std::string continent;
    std::string gender;
    double economic_situation;
    int credit_score;
    bool loan_rejected;
    bool defaulted;

    // constructor
    User(int id, int a, std::string r, std::string c, std::string g, double econ, int score, bool reject_rate, bool def)
        : user_id(id), race(r), continent(c), gender(g), economic_situation(econ),
          credit_score(score), loan_rejected(reject_rate), defaulted(def) {
        if (a <= 12) {
            age = "child";
        } else if (a <= 17) {
            age = "adolescent";
        } else if (a <= 64) {
            age = "adult";
        } else {
            age = "senior";
        }
    }
};

#endif