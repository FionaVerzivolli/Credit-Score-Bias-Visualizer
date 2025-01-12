#ifndef BIAS_H
#define BIAS_H

#include <vector>
#include <string>
#include "user.h"
#include "filters.h"

double calculateFilteredFalsePositiveRate(const std::vector<User>& users, const Filter& filters);
double calculateFilteredDemographicParity(const std::vector<User>& users, const Filter& filters);
double calculateGroupDisparity(const std::vector<User>& users, const Filter& group1Filters, const Filter& group2Filters);
std::string assignLetterGrade(double fpr, double disparity);

#endif
