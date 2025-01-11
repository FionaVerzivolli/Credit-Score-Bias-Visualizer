#include <iostream>
#include <fstream>
#include <vector>
#include <map>
#include <string>
#include <algorithm>
#include "user.h"

// function to calculate the false positive rate of a demographic
// will need to do this each time per each demographic and then visualize it in UI
double calculateFalsePositiveRate(const std::vector<User>& users, const std::string& race) {
    int falsePositives = 0, trueNegatives = 0;

    for (const auto& u : users) {
        if (u.race == race) { // focus only on given race per calculation
            if (u.credit_score < 600 && !u.defaulted) {
                // flagged as risky but did not default = false positive
                falsePositives++;
            }
            if (u.credit_score >= 600 && !u.defaulted) {
                // not flagged as risky and did not default = true negative
                trueNegatives++;
            }
        }
    }

    // case for division by zero
    if (falsePositives + trueNegatives == 0) return 0.0;

    // calculate rate
    return static_cast<double>(falsePositives) / (falsePositives + trueNegatives);
}


double calculateDemographicParity(const std::vector<User> &users, const std::string &race) {
    int approved = 0, total = 0;
    for (const auto &u : users) {
        if (u.race == race) {
            if (u.credit_score >= 700) // approval threshold
                approved++;
            total++;
        }
    }
    if (total == 0) return 0.0;
    return static_cast<double>(approved) / total;
}

// calculate disparity between two groups. use rcan click on which two groups it
// wants to compare and we can just generate this

double calculateGroupDisparity(const std::vector<User> &users, const std::string &group1, const std::string &group2) {
    double avgScoreGroup1 = 0, avgScoreGroup2 = 0;
    int countGroup1 = 0, countGroup2 = 0;

    for (const auto &u : users) {
        if (u.race == group1) {
            avgScoreGroup1 += u.credit_score;
            countGroup1++;
        } else if (u.race == group2) {
            avgScoreGroup2 += u.credit_score;
            countGroup2++;
        }
    }
    if(countGroup1 == 0) return 0.0;
    if(countGroup2 == 0) return 0.0;

    avgScoreGroup1 /= countGroup1;
    avgScoreGroup2 /= countGroup2;

    return avgScoreGroup1 / avgScoreGroup2;
}

double calculateAgeAvg(const std::vector<User> &users, const int &age) {
    int approved = 0, total = 0;
    for (const auto &u : users) {
        if (u.age == age) {
            approved += u.credit_score;
            total++;
        }
    }
    if (total == 0) return 0.0;

    return static_cast<double>(approved) / total;
}

double calculateGenderAvg(const std::vector<User> &users, const std::string &gender) {
    int approved = 0, total = 0;
    for (const auto &u : users) {
        if (u.gender == gender) {
            approved += u.credit_score;
            total++;
        }
    }
    if (total == 0) return 0.0;
    return static_cast<double>(approved) / total;
}

double calculateRaceAvg(const std::vector<User> &users, const std::string &race) {
    int approved = 0, total = 0;
    for (const auto &u : users) {
        if (u.race == race) {
            approved += u.credit_score;
            total++;
        }
    }
    if (total == 0) return 0.0;
    return static_cast<double>(approved) / total;
}

// assign letter grade based off of how low the bias is
std::string assignLetterGrade(double fpr, double disparity) {
    // fpr = false positive rate
    if (fpr <= 0.1 && disparity >= 0.9)
        return "A";
    else if (fpr <= 0.2 && disparity >= 0.8)
        return "B";
    else if (fpr <= 0.3 && disparity >= 0.7)
        return "C";
    else if (fpr <= 0.4 && disparity >= 0.6)
        return "D";
    else
        return "F";
}
