import React,{useState} from 'react'

import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'

const DatasetFilter = (props) => {

    const handleChange = (event) => {
        props.setDatasetFunc(event.target.value)
    }

    return (
        <div>
            <p style={{ fontWeight: "bold" }}> Dataset </p>
            <FormControl style={{
                boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2), \
                    0px 1px 1px 0px rgba(0,0,0,0.14), \
                    0px 2px 1px -1px rgba(0,0,0,0.12)",
                background: "#FFF",
                paddingTop: "5px",
            }} component="fieldset">
                <RadioGroup aria-label="position" name="position" value={props.dataset} onChange={handleChange} row>
                    <FormControlLabel
                        value="pqtl"
                        control={<Radio color="primary" />}
                        label={<div style={{ fontSize: "20px" }}>PQTL</div>}
                        labelPlacement="top"
                        style={{ fontSize: "20px" }}
                    />
                    <FormControlLabel
                        value="eqtloverlap"
                        control={<Radio color="primary" />}
                        label={<div style={{ fontSize: "20px" }}>EQTL-Overlap</div>}
                        labelPlacement="top"
                    />
                    <FormControlLabel
                        value="pqtloverlap"
                        control={<Radio color="primary" />}
                        label={<div style={{ fontSize: "20px" }}>PQTL-Overlap</div>}
                        labelPlacement="top"
                    />
                </RadioGroup>
            </FormControl>
        </div>
    )
}

export default DatasetFilter