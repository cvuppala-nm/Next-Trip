import React from 'react';
import { Form } from 'react-bootstrap';

const FormSelect = (props) => {
  return (
    <Form data-testid={props.id}>
      <Form.Group className="mb-3" controlId={props.id}>
        <Form.Control as="select" data-testid={`${props.id}.Select`} value={props.value} custom onChange={props.onChange}>
          <option value="">{props.label}</option>
          {props.list.map((direction, index) => 
            <option 
              key={props.type + index}
              value={direction.Value}
              data-testid={`${props.id}.Option`}
            >{direction.Text}</option>
          )}
        </Form.Control>
        <Form.Label className="sr-only">{props.label}</Form.Label>
      </Form.Group>
    </Form>
  );
}

export default FormSelect;