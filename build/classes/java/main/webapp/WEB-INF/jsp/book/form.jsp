<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Create/Edit book form</title>
<link href="../css/buttonStyle.css" rel="stylesheet">
<link href="../css/formStyle.css" rel="stylesheet">
</head>
<body> 

	<h1>Book Form</h1>
	
<!-- 	Get parameter from the URL -->
	<%
   	String storeId=request.getParameter("storeId");
   	pageContext.setAttribute("storeId", storeId);
 	%>
	
	<form:form name="createBookForm" method="post" action="save" modelAttribute="book">
 		<form:hidden path="id"/>
		<input type="hidden" id="storeId" name="storeId" value="${storeId}" />
		<table>
			<tr>
				<td>Book Name:</td>
				<td><form:input path="bookName"/></td> 
			</tr>

			<tr>
				<td>Category:</td>
				<td><form:input path="category" /></td>
			</tr>

			<tr>
				<td>Price</td>
				<td><form:input path="price" /></td>
			</tr>

			<tr>
				<td><input type="submit" value="Save Book"></td>
			</tr>

		</table>
	</form:form>
	
</body>
</html>