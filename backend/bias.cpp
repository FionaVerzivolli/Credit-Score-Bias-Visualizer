#include <vector>
#include <string>
#include "user.h"

// calculate false positive rate (fpr) for a specific group and criterion
double calculateFalsePositiveRate(const std::vector<User>& users, const std::string& group, const std::string& criterion) {
    int falsePositives = 0, trueNegatives = 0;

    for (const auto& user : users) {
        if ((criterion == "race" && user.race == group) ||
            (criterion == "gender" && user.gender == group) ||
            (criterion == "continent" && user.continent == group)) {
            if (user.credit_score < 600 && !user.defaulted) {
                falsePositives++; // flagged as risky but did not default
            }
            if (user.credit_score >= 600 && !user.defaulted) {
                trueNegatives++; // not flagged as risky and did not default
            }
        }
    }

    return (falsePositives + trueNegatives) > 0 
        ? static_cast<double>(falsePositives) / (falsePositives + trueNegatives) 
        : 0.0; // avoid division by zero
}

// calculate demographic parity for a given race
double calculateDemographicParity(const std::vector<User>& users, const std::string& race) {
    int approved = 0, total = 0;

    for (const auto& user : users) {
        if (user.race == race) {
            if (user.credit_score >= 700) { // approval threshold
                approved++;
            }
            total++;
        }
    }

    return total > 0 ? static_cast<double>(approved) / total : 0.0; // avoid division by zero
}

// calculate group disparity between two groups (e.g., race, gender, continent)
double calculateGroupDisparity(const std::vector<User>& users, const std::string& group1, const std::string& group2) {
    double avgScoreGroup1 = 0, avgScoreGroup2 = 0;
    int countGroup1 = 0, countGroup2 = 0;

    for (const auto& user : users) {
        if (user.race == group1 || user.continent == group1 || user.gender == group1 || user.age == group1) {
            avgScoreGroup1 += user.credit_score;
            countGroup1++;
        } else if (user.race == group2 || user.continent == group2 || user.gender == group2 || user.age == group2) {
            avgScoreGroup2 += user.credit_score;
            countGroup2++;
        }
    }

    if (countGroup1 == 0 || countGroup2 == 0) return 0.0; // avoid division by zero

    avgScoreGroup1 /= countGroup1;
    avgScoreGroup2 /= countGroup2;

    return avgScoreGroup2 > 0 ? avgScoreGroup1 / avgScoreGroup2 : 0.0; // avoid division by zero
}


// calculate average credit score for a specific age
double calculateAgeAvg(const std::vector<User>& users, std::string age) {
    int totalScore = 0, count = 0;

    for (const auto& user : users) {
        if (user.age == age) {
            totalScore += user.credit_score;
            count++;
        }
    }

    return count > 0 ? static_cast<double>(totalScore) / count : 0.0; // avoid division by zero
}

// calculate average credit score for a specific gender
double calculateGenderAvg(const std::vector<User>& users, const std::string& gender) {
    int totalScore = 0, count = 0;

    for (const auto& user : users) {
        if (user.gender == gender) {
            totalScore += user.credit_score;
            count++;
        }
    }

    return count > 0 ? static_cast<double>(totalScore) / count : 0.0; // avoid division by zero
}

// calculate average credit score for a specific race
double calculateRaceAvg(const std::vector<User>& users, const std::string& race) {
    int totalScore = 0, count = 0;

    for (const auto& user : users) {
        if (user.race == race) {
            totalScore += user.credit_score;
            count++;
        }
    }

    return count > 0 ? static_cast<double>(totalScore) / count : 0.0; // avoid division by zero
}

// assign a letter grade based on bias metrics (false positive rate and disparity)
std::string assignLetterGrade(double fpr, double disparity) {
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
