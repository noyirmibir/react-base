import ErrorMessage from './errorMessage';
import NumberFormat from 'react-number-format';
import React, { ReactElement, useContext, useEffect } from 'react';
import { validateFormItem, Validation, ValidationType } from '../models/validations';
import { FormContext } from '..';

type InputNumberProps = {
    name: string,
    value?: string,
    isDisabled?: boolean,
    label?: string,
    placeholder?: string,
    isValid?: boolean,
    rules?: Array<Validation>,
    classNames?: string,
    changeFunction?: Function,
    children?: ReactElement,
    customization?: {
        thousandSeparator?: string,
        decimalSeparator?: string,
        decimalScale?: number,
        fixedDecimalScale?: boolean,
        prefix?: string,
        suffix?: string
    }
}

const InputNumber = (props: InputNumberProps) => {
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
            <NumberFormat
                name={props.name}
                value={props.value}
                thousandSeparator={props.customization?.thousandSeparator}
                decimalSeparator={props.customization?.decimalSeparator}
                decimalScale={props.customization?.decimalScale}
                fixedDecimalScale={props.customization?.fixedDecimalScale}
                suffix={props.customization?.suffix}
                prefix={props.customization?.prefix}
                placeholder={props.placeholder}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { handleChange(e.target.value) }}
                {...(props.isDisabled ? {disabled: true} : {})}
            />
            {props.children}
            <ErrorMessage rules={item?.rules} />
        </div>
    )
}

export default InputNumber;