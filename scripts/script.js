// валидация формы следующим образом:
/// 1. Все поля должны быть заполнены
/// 2. Full Name может содержать только буквы и пробел
/// 3. Your username - может содержать только буквы, цифры, символ подчеркивания и тире
/// 4. Реализовать проверку введенного E-mail на корректность
/// 5. Поле пароля должно содержать минимум 8 символов, среди которых есть:
///    - хотя бы одна буква в верхнем регистре
/// - хотя бы одна цифра
/// - хотя бы один спецсимвол
/// 6. Password и Repeat Password должны совпадать
/// 7. Пользователь должен согласиться с условиями

// Если какое-то поле не прошло валидацию, рамка поля становится красной, а под полем появляется текст,
// поясняющий ошибку. К примеру, «Заполните поле E-mail» или «Full Name может содержать только буквы и пробел».
// Для проверок используйте регулярные выражения.
//

window.onload = function () {
    let FullName = document.getElementById('FullName');
    let YourUsername = document.getElementById('YourUsername');
    let Email = document.getElementById('Email');
    let Password = document.getElementById('Password');
    let RepeatPassword = document.getElementById('RepeatPassword');
    let termsOfServiceCheckbox = document.getElementById('termsOfServiceCheckbox');
    let SignUpButton = document.getElementById('SignUpButton');
    let OkButton = document.getElementById('OkButton');
    let accountHref = document.getElementById('accountHref');
    let popup = document.getElementById('popup');
    let PasswordValidationErrorMessage = document.getElementById('PasswordValidationErrorMessage');
    let EmailValidationErrorMessage = document.getElementById('EmailValidationErrorMessage');
    let inputs = document.getElementsByTagName("input");
    let reg_letters = /^[a-zA-Z\s]*$/;
    let reg_lettersAndNumbers = /^[\w-]*$/;
    let reg_email = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,})/;
    let reg_password = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,})/;
    let errorMessages = document.querySelectorAll("p.error-message");

    function EmailValidation() {
        if (!reg_email.test(Email.value)) {
            EmailValidationErrorMessage.style.display = "block";
            return false;
        } else return true;
    }

    function PasswordValidation() {
        if (!reg_password.test(Password.value)) {
            PasswordValidationErrorMessage.style.display = "block";
            // alert('password must contain at least 8 characters, including at least one uppercase letter, at least one number, at least one special character')
            return false;
        } else return true;
    }

    function ResetInputsBorder() {
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].style.borderBottom = "1px solid #C6C6C4";
        }
    }

    function RedInputBorder(val) {
        val.style.borderBottom = "1px solid red";
    }

    function hideErrorMessages() {
        for (let i = 0; i < errorMessages.length; i++) {
            errorMessages[i].style.display = "none";
        }
    }

    function next(elem) {
        do {
            elem = elem.nextSibling;
        } while (elem && elem.nodeType !== 1);
        return elem;
    }

    function showErrorMessage(val) {
        let nextElem = next(val);
        nextElem.style.display = "block";
    }

    function showErrorMessage2(val) {
        let nextNextElem = next(next(val));
        nextNextElem.style.display = "block";
    }

    function SignInValidation() {
        hideErrorMessages();
        ResetInputsBorder();
        if (!YourUsername.value) {
            RedInputBorder(YourUsername);
            showErrorMessage(YourUsername);
            return;
        }
        if (!Password.value) {
            RedInputBorder(Password);
            showErrorMessage(Password);
            return;
        }
        let localClients = localStorage.getItem('clients');
        let localClientsArray = JSON.parse(localClients);
        let rightUsername = false;
        let rightClient = false;
        for (let i = 0; i < localClientsArray.length; i++) {
            if (localClientsArray[i].Username == YourUsername.value && localClientsArray[i].Password == Password.value) {
                rightClient = true;
                console.log('rightClient = true');
                break;
            }
            if (localClientsArray[i].Username == YourUsername.value && localClientsArray[i].Password !== Password.value) {
                rightUsername = true;
                break;
            }
        }
        if (rightClient) {
            document.getElementById('mainHeader').innerText = "Welcome, " + YourUsername.value + '!';
            SignUpButton.innerText = "Exit";
            document.getElementById('headerText').style.display = 'none';
            document.getElementById('YourUsernameItem').style.display = 'none';
            document.getElementById('PasswordItem').style.display = 'none';
            accountHref.style.display = 'none';
            SignUpButton.removeEventListener("click", SignInValidation);
            SignUpButton.addEventListener("click", goToRegistrationPage);
            return;
        }
        console.log(rightUsername);
        if (rightUsername) {
            RedInputBorder(Password);
            document.getElementById('wrongPassword').style.display = 'block';
            return;
        } else {
            RedInputBorder(YourUsername);
            document.getElementById('wrongYourUsername').style.display = 'block';
            return;
        }
    }

    function SignUpValidation() {
        hideErrorMessages();
        ResetInputsBorder();
        if (!FullName.value) {
            RedInputBorder(FullName);
            showErrorMessage(FullName);
            return;
        }
        if (!YourUsername.value) {
            RedInputBorder(YourUsername);
            showErrorMessage(YourUsername);
            return;
        }
        if (!Email.value) {
            RedInputBorder(Email);
            showErrorMessage(Email);
            return;
        }
        if (!EmailValidation()) {
            return;
        }

        if (!Password.value) {
            RedInputBorder(Password);
            showErrorMessage(Password);
        }
        if (!PasswordValidation()) {
            return;
        }
        if (Password.value !== RepeatPassword.value) {
            RedInputBorder(RepeatPassword);
            showErrorMessage(RepeatPassword);
            return;
        }
        if (!termsOfServiceCheckbox.checked) {
            RedInputBorder(termsOfServiceCheckbox);
            showErrorMessage2(termsOfServiceCheckbox);
            return;
        }
        let newClient = {
            FullName: FullName.value,
            Username: YourUsername.value,
            Email: Email.value,
            Password: Password.value
        };
        let clients = localStorage.getItem('clients'); //хранилище как string
        let clientsArray = [];
        if (clients) { //если что то внутри есть
            clientsArray = JSON.parse(clients);
        }
        clientsArray.push(newClient);
        localStorage.setItem('clients', JSON.stringify(clientsArray));

        SignUpButton.removeEventListener("click", SignUpValidation);
        SignUpButton.addEventListener("click", SignInValidation);

        console.log(localStorage);

        popup.classList.add("show");
    }

    function goToRegistrationPage() {
        location.reload();
    }

    function createSignInForm() {
        document.getElementById('mainHeader').innerText = "Log in to the system";
        document.getElementById('FullNameItem').style.display = 'none';
        document.getElementById('EmailItem').style.display = 'none';
        document.getElementById('RepeatPasswordItem').style.display = 'none';
        document.getElementById('termsOfService').style.display = 'none';
        SignUpButton.innerText = "Sign In";
        // accountHref.style.display = "none";
        accountHref.innerHTML = "Registration";
        accountHref.removeEventListener("click", createSignInForm);
        accountHref.addEventListener("click", goToRegistrationPage);
        SignUpButton.removeEventListener("click", SignUpValidation);
        SignUpButton.addEventListener("click", SignInValidation);
    }

    FullName.onkeydown = (e) => {
        if (!reg_letters.test(e.key)) {
            return false;
        }
    }
    YourUsername.onkeydown = (e) => {
        if (!reg_lettersAndNumbers.test(e.key)) {
            return false;
        }
    }
    termsOfServiceCheckbox.onclick = () => {
        termsOfServiceCheckbox.checked ? console.log('Согласен') : console.log('Не согласен');
    }
    SignUpButton.addEventListener("click", SignUpValidation);
    OkButton.addEventListener("click", function () {
        popup.classList.remove("show");
        createSignInForm();
    });
    accountHref.addEventListener("click", createSignInForm);
    console.log("success!");
}