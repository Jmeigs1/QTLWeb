import React from 'react'

const InlineDiv = (props) => {

    const childCount = props.children.length

    return (
        <div style={{...props.style, width:"100%"}}>
            {React.Children.map(props.children,
                (child,i) => {
                    return (
                        <div style={{
                            display:"inline-block",
                            width:`${100/childCount}%`,
                            margin:"0",
                            padding:"20px",
                            boxSizing:"border-box",
                            verticalAlign:"top",
                            }}
                            key={i}
                            >
                            {child}
                        </div>
                        )
                }
            )}
        </div>
    )
}

export default InlineDiv