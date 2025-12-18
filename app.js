const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

// Главная страница — рендерим index.ejs
app.get('/', (req, res) => {
    res.render('index', { result: null, error: null });
});

// Обработка формы
app.post('/', (req, res) => {
    let { weight, height, age, gender } = req.body;

    weight = parseFloat(weight);
    height = parseFloat(height);
    age = parseFloat(age);

    if (!weight || !height || !age || !gender || weight <= 0 || height <= 0 || age <= 0) {
        return res.render('index', {
            result: null,
            error: 'Invalid input! Please fill all fields with positive numbers.'
        });
    }

    const bmi = weight / (height * height);

    let bmiCategory, categoryClass;
    if (bmi < 18.5) {
        bmiCategory = "Underweight";
        categoryClass = "underweight";
    } else if (bmi < 25) {
        bmiCategory = "Normal weight";
        categoryClass = "normal";
    } else if (bmi < 30) {
        bmiCategory = "Overweight";
        categoryClass = "overweight";
    } else {
        bmiCategory = "Obese";
        categoryClass = "obese";
    }

    let bodyFat = gender === "male"
        ? 1.20 * bmi + 0.23 * age - 16.2
        : 1.20 * bmi + 0.23 * age - 5.4;
    bodyFat = Math.max(0, Math.min(100, bodyFat));

    const musclePercent = 100 - bodyFat;

    const recommendations = {
        underweight: [
            "Increase your daily calorie intake by 300-500 kcal.",
            "Focus on protein-rich foods: meat, fish, eggs, dairy.",
            "Incorporate strength training to build muscle.",
            "Consult a doctor to rule out underlying issues."
        ],
        normal: [
            "Great job! Maintain your current healthy lifestyle.",
            "Eat balanced meals and stay active.",
            "Aim for at least 150 minutes of moderate exercise per week.",
            "Monitor your diet to prevent gradual weight gain."
        ],
        overweight: [
            "Reduce daily calories by 300-500 for gradual weight loss.",
            "Increase vegetables, fruits, and whole grains.",
            "Add cardio activities like walking, running, or swimming.",
            "Target 0.5-1 kg loss per week for sustainable results."
        ],
        obese: [
            "Consult a doctor or nutritionist for personalized advice.",
            "Significantly reduce sugar and processed foods.",
            "Combine diet changes with regular exercise.",
            "Consider professional support for safe weight management."
        ]
    };

    const key = bmi < 18.5 ? "underweight" : bmi < 25 ? "normal" : bmi < 30 ? "overweight" : "obese";

    const result = {
        bmi,
        bmiCategory,
        categoryClass,
        bodyFat,
        musclePercent,
        recommendations: recommendations[key]
    };

    res.render('index', { result, error: null });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});