export const fetchAutocomplete = (input) => new Promise((res, rej) => {
    const url = `https://api.api-ninjas.com/v1/city?name=${input}&limit=5&X-Api-Key=fPxlMogzzLQ4pjLuQHWS4w==x9g7XnHSXgG2AxwH`;
    
    fetch(url)
        .then(string => {
            if (string.ok) res(string.json())
            else throw new Error()
        })
        .catch(err => res([]))
})