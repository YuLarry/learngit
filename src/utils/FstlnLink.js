/*
 * @Author: lijunwei
 * @Date: 2021-11-17 16:46:47
 * @LastEditTime: 2022-03-01 15:34:53
 * @LastEditors: lijunwei
 * @Description: 
 *  Customed Link component. 
 *  links without Protocol, origin and port use default a tag and other links use react-router Link
 */

import { Link } from "react-router-dom";



function FstlnLink( {children, url = '', external, ref, ...rest} ) {
  const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

  if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
    rest.target = '_blank';
    rest.rel = 'noopener noreferrer';
    return (
      <a href={url} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link to={url} {...rest}>
      {children}
    </Link>
  );
}
export { FstlnLink }
