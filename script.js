const ques = document.querySelectorAll('.ques');
const ans = document.querySelectorAll('.ans');
const caret = document.querySelectorAll('.caret')

ques.forEach((question, index) => {
    question.addEventListener('click', function() {
        // console.log(ans[index].innerText);
        if (ans[index].classList.contains('active')) {
            ans[index].classList.remove('active');
        }
        else {
            ans[index].classList.add('active');
        }

        ans.forEach(answer => {
            if (answer.classList.contains('active')) {
                answer.classList.remove('active');
                ans[index].classList.add('active');
            }
        })

        ans.forEach((answer, index) => {
            if (answer.classList.contains('active')) {
                caret[index].classList.remove('fa-caret-down');
                caret[index].classList.add('fa-caret-up');
            } else {
                caret[index].classList.add('fa-caret-down');
                caret[index].classList.remove('fa-caret-up');
            }
        })


    })
})
