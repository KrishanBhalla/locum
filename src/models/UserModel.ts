
export class UserModel {

    username: string
    email: string
    token: string

    constructor(username: string, email: string, persistentToken: string) {
        this.username = username
        this.email = email
        this.token = persistentToken
    }

    public async validateCredentials(): Promise<void> {
        const response = await fetch("localhost:8080/login", {
            method: 'POST',
            body: JSON.stringify({email: this.email, username: this.username, token: this.token}),
            headers: {'Content-Type': 'application/json'} 
          });
          
          if (!response.ok) 
          { 
              console.error("Error");
          }
          else if (response.status >= 400) {
              console.error('HTTP Error: '+response.status+' - '+response.statusText);
          }
          // Success!
    }

}
