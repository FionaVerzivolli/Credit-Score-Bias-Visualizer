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
    std::string race;
    std::string continent; // focus on african communities
    std::string gender;
    double economic_situation; // still don't know how exactly we are meant to quantify this
    int credit_score;
    bool loan_rejected; // if they have been rejected from a loan before, but i think this is the same as defaulted
    bool defaulted; // whether theyre defaulted or not
    
    //constructor
    User(int id, std::string r, std::string c, std::string g, double econ, int score, bool reject_rate, bool def)
        : user_id(id), race(r), continent(c), gender(g), economic_situation(econ),
         credit_score(score), loan_rejected(reject_rate), defaulted(def) {}
};

#endif

