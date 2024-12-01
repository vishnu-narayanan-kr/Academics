import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Input from "@mui/material/Input"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import { useContext, useRef, useState } from "react"
import { Auth } from "../Context/AuthContext"
import { useNavigate } from "react-router"
import { loginSOAPApi, postUserSOAPApi } from "../APIs/SOAP/auth"

export const AuthPage = () => {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const rePasswordRef = useRef();
    const roleRef = useRef("customer");
    const navigate = useNavigate();

    const { setAuthUser } = useContext(Auth)

    const [isReg, setIsReg] = useState(false);

    const onRegister = async () => {
        if (!isReg) {
            setIsReg(true)
        } else {
            // check password validity first
            const user = {
                username: usernameRef.current,
                password: passwordRef.current,
                role: roleRef.current,
            }

            await postUserSOAPApi({ user });
        }
    }

    const onLogin = async () => {
        if (isReg) {
            setIsReg(false)
        } else {
            const user = {
                username: usernameRef.current,
                password: passwordRef.current,
            }

            const body = await loginSOAPApi({ user });
            
            if (body) {
                delete body.message;

                const authUser = {
                    username: user.username,
                    ...body
                }

                setAuthUser(authUser);
                
                if(authUser.role === "customer") {
                    navigate("/ViewMenus")
                } else if(authUser.role === "manager") {
                    navigate("/ManageMenus")
                }
            }
        }
    }

    let headingText = "Login";
    let loginButtonText = "Login";
    let registerButtonText = "Register Instead?"

    if (isReg) {
        headingText = "Register";
        loginButtonText = "Login Instead?";
        registerButtonText = "Register";
    }

    return (
        <div>
            <Container className="add-menu-container" maxWidth={false}>
                <h2>{headingText}</h2>
                <FormControl className="form-element">
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <Input onChange={e => {usernameRef.current = e.target.value}} id="username" aria-describedby="user-name" />
                </FormControl>
                <FormControl className="form-element">
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input onChange={e => {passwordRef.current = e.target.value}} id="password" aria-describedby="password" />
                </FormControl>
                {
                    isReg ?  (
                        <>
                            <FormControl className="form-element">
                                <InputLabel htmlFor="repassword">Re-Password</InputLabel>
                                <Input onChange={e => {rePasswordRef.current = e.target.value}} id="repassword" aria-describedby="re-enter-password" />
                            </FormControl>
                            <FormControl className="form-element">
                                <InputLabel htmlFor="role">role</InputLabel>
                                <Select
                                    labelId="role"
                                    id="role"
                                    defaultValue={roleRef.current}
                                    label="role"
                                    onChange={(e) => {roleRef.current = e.target.value }}
                                >
                                    <MenuItem value={"customer"}>Customer</MenuItem>
                                    <MenuItem value={"manager"}>Manager</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    ) : null
                }
                <FormControl className="form-element">
                    <Button variant="contained" color="success" onClick={onLogin}>
                        {loginButtonText}
                    </Button>
                </FormControl>
                <FormControl className="form-element">
                    <Button variant="contained" color="secondary" onClick={onRegister}>
                        {registerButtonText}
                    </Button>
                </FormControl>
            </Container>
        </div>
    )
}