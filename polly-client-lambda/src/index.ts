export class Program {
  public main(event: any) {
    console.log('Hello World!');
    const response = 'Hello World!' + JSON.stringify(event, null, 2);
    return response;
  }
}

exports.handler = async (event: any = {}): Promise<any> => {
  const prog = new Program();
  prog.main(event);
}


