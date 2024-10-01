class TotpSecret {
    constructor(secret, codeLength, timeLength, id, name) {
      this.secret = secret;
      this.codeLength = codeLength;
      this.timeLength = timeLength;
      this.id = id;
      this.name = name;
    }
  
    // Convert to plain object for storage
    toObject() {
      return {
        secret: this.secret,
        codeLength: this.codeLength,
        timeLength: this.timeLength,
        id: this.id,
        name: this.name
      };
    }
  
    // Static method to create an instance from a plain object
    static fromObject(obj) {
      return new TotpSecret(obj.secret, obj.codeLength, obj.timeLength, obj.id, obj.name);
    }
  }
  