const soapURL = "http://localhost:8080/WebOnlineFoodDeliveryServiceProject/ws/Auth";

const getSoapRequestBody = (payload) => {
    return `<?xml version='1.0' encoding='UTF-8'?>
                <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://webOnlineFoodDeliveryServiceSOAP/">
                    <soap:Body>
                        ${payload}   
                    </soap:Body>
                </soap:Envelope>`
}

const getObjectFromXML = async ({ xmlResponse, tags }) => {
    const parser = new DOMParser();
    const reponseText = await xmlResponse.text()
    const xmlDoc = parser.parseFromString(reponseText, "text/xml");

    const result = {};

    tags.forEach(tag => {
        result[tag] = xmlDoc.getElementsByTagName(tag)[0].textContent;
    });

    return result;
}

export const postUserSOAPApi = async ({ user }) => {
    const payload = `<tns:Register>
                            <username>${user.username}</username>
                            <password>${user.password}</password>
                            <role>${user.role}</role>
                    </tns:Register>`;

    try {
        const xmlResponse = await fetch(soapURL, {
            method: "POST",
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
                "SOAPAction": "http://webOnlineFoodDeliveryServiceSOAP/Register"
            },
            body: getSoapRequestBody(payload)
        })

        if(xmlResponse.ok) {
            const tags = ["message"]
            const user = await getObjectFromXML({ xmlResponse, tags });
            return user;
        }
    } catch (error) {
        console.log(error);
        return {};
    }
}

export const loginSOAPApi = async ({ user }) => {
    const payload = `<tns:Login>
                            <username>${user.username}</username>
                            <password>${user.password}</password>
                    </tns:Login>`;

    try {
        const xmlResponse = await fetch(soapURL, {
            method: "POST",
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
                "SOAPAction": "http://webOnlineFoodDeliveryServiceSOAP/Login"
            },
            body: getSoapRequestBody(payload)
        })

        if(xmlResponse.ok) {
            const tags = ["token", "role", "message"]
            const user = await getObjectFromXML({ xmlResponse, tags });
            return user;
        }
    } catch (error) {
        console.log(error);
        return {};
    }
}