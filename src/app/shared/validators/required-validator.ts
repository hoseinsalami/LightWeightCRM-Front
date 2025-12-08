import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
export function requiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const inputValue = control.value;

        if (Validators.required(control)) {
            return { text: "اجباریست" };
        } else {
            return null;
        }

    };
}
