declare module 'resemblejs' {
  interface ResembleData {
    misMatchPercentage?: string;
  }

  interface ResembleComparison {
    compareTo(image: string): ResembleComparison;
    ignoreAntialiasing(): ResembleComparison;
    onComplete(callback: (data: ResembleData) => void): void;
  }

  function resemble(image: string): ResembleComparison;

  export default resemble;
}
