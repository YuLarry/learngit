/*
 * @Author: lijunwei
 * @Date: 2021-12-31 18:31:58
 * @LastEditTime: 2022-01-10 17:31:23
 * @LastEditors: lijunwei
 * @Description: 
 */

function SegmentIcon(props) {

  const segment = (
    <svg width="20" height="20" viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
      <path d="M9.86763 7.28158C9.86763 9.09395 8.35989 10.5632 6.5 10.5632C4.64011 10.5632 3.13237 9.09395 3.13237 7.28158C3.13237 5.46921 4.64011 4 6.5 4C8.35989 4 9.86763 5.46921 9.86763 7.28158Z" />
      <path d="M0.534408 14.4759C1.63998 13.6286 3.84022 12.2572 6.5 12.2572C9.15978 12.2572 11.36 13.6286 12.4656 14.4759C12.9591 14.8541 13.113 15.4934 12.9181 16.075L12.6522 16.8685C12.4261 17.5434 11.7802 18 11.0516 18H1.94841C1.21985 18 0.573921 17.5434 0.347772 16.8685L0.081858 16.075C-0.113018 15.4934 0.040922 14.8541 0.534408 14.4759Z" />
      <path d="M0.534408 14.4759C1.63998 13.6286 3.84022 12.2572 6.5 12.2572C9.15978 12.2572 11.36 13.6286 12.4656 14.4759C12.9591 14.8541 13.113 15.4934 12.9181 16.075L12.6522 16.8685C12.4261 17.5434 11.7802 18 11.0516 18H1.94841C1.21985 18 0.573921 17.5434 0.347772 16.8685L0.081858 16.075C-0.113018 15.4934 0.040922 14.8541 0.534408 14.4759Z" />
      <path d="M15.625 12.8872C16.8768 12.8872 17.8917 11.8771 17.8917 10.6311C17.8917 9.38509 16.8768 8.375 15.625 8.375C14.3732 8.375 13.3583 9.38509 13.3583 10.6311C13.3583 11.8771 14.3732 12.8872 15.625 12.8872ZM12.7777 14.8157C12.2948 15.0732 11.8972 15.3521 11.6097 15.5772C11.2775 15.8372 11.1739 16.2767 11.3051 16.6765L11.4841 17.2221C11.5589 17.4502 11.702 17.6421 11.8865 17.7782C12.2395 17.5802 12.516 17.2614 12.6489 16.8685L12.9174 16.075C13.0633 15.6436 13.0155 15.1805 12.7777 14.8157ZM12.4525 17.9948C12.4884 17.9982 12.5248 18 12.5614 18H18.6886C19.179 18 19.6137 17.6861 19.7659 17.2221L19.9449 16.6765C20.0761 16.2767 19.9725 15.8372 19.6403 15.5772C18.8962 14.9947 17.4152 14.0518 15.625 14.0518C14.7318 14.0518 13.9156 14.2865 13.2295 14.5941C13.5266 15.085 13.5757 15.6892 13.391 16.2352L13.1225 17.0287C12.9914 17.4164 12.7553 17.7463 12.4525 17.9948Z" />
    </svg>
  );
  // console.log(segment);
  return (
    <span className="Polaris-Icon">
    <span className="Polaris-VisuallyHidden"></span>
      {segment}
    </span>
  );
}
export { SegmentIcon }