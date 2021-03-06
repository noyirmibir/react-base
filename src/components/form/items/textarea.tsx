import React, { ReactElement, useContext, useEffect } from 'react';
import { FormContext } from '..';
import { Prevention, preventKey } from '../models/preventions';
import { validateFormItem, Validation, ValidationType } from '../models/validations';
import ErrorMessage from './errorMessage';

type TextareaProps = {
    name: string,
    value?: string,
    isDisabled?: boolean,
    label?: string,
    placeholder?: string,
    isValid?: boolean,
    rules?: Array<Validation>,
    prevention?: Prevention,
    classNames?: string,
    changeFunction?: Function,
    children?: ReactElement
}

const Textarea = (props: TextareaProps) => {
    const context = useContext(FormContext);
    const item = context.model.items.find(x => x.name === props.name);

    useEffect(() => {
        if (context.model.items.some(x => x.name === props.name)) {
            throw new Error("Development error ---> Each form element must have unique name!");
        }

        context.model.items.push({
            name: props.name,
            value: props.value??"",
            rules: props.rules,
            isValid: (props.rules ? props.isValid : true)
        });

        context.setModel({...context.model});

        return () => {
            context.model.items = context.model.items.filter(x => x.name !== props.name);

            context.setModel({...context.model});
        }
    }, []);

    const handleChange = (value: string) => {
        if (item) {
            item.value = value;
            validateFormItem(item, context.model.items);

            context.setModel({...context.model});
        }

        if (props.changeFunction) {
            props.changeFunction(value);
        }
    }

    return (
        <div className={"form-item" + ((item?.value??"".toString()).length > 0 ? " filled" : "") + (item?.isValid === false ? " error" : "") + (props.classNames ? " " + props.classNames : "")}>
            {props.label &&
                <label>{props.label}</label>
            }
            <textarea
                name={props.name}
                defaultValue={props.value}
                placeholder={props.placeholder}
                onKeyPress={(e) => preventKey(e, props.prevention)}
                onChange={(e) => { handleChange(e.target.value) }}
                {...(props.isDisabled ? { disabled: true } : {})}
            ></textarea>
            {props.children}
            <ErrorMessage rules={item?.rules} />
        </div>
    )
}

export default Textarea;