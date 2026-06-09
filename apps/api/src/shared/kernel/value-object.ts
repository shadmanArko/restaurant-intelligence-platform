export abstract class ValueObject<Props extends object> {
  protected constructor(public readonly props: Props) {}

  equals(valueObject: ValueObject<Props>): boolean {
    return JSON.stringify(this.props) === JSON.stringify(valueObject.props);
  }
}
