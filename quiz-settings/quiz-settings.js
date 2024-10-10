    const submitBtn = document.querySelector('.submitBtn');
    const form = document.querySelector('.form');
    const noOfQues = document.getElementById('noOfQues');
    const category = document.getElementById('category');
    const difficulty = document.getElementById('difficulty');

    // console.log(form);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // console.log(noOfQues.value, category.value, difficulty.value);
        const formData = {
            noOfQues: noOfQues.value,
            category: category.value,
            difficulty: difficulty.value
        }
        localStorage.setItem('formData', JSON.stringify(formData));
        
        window.location.href = 'quiz.html'; 
    })