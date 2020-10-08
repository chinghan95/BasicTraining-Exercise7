<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Create/Edit bookstore form</title>
<link href="../css/buttonStyle.css" rel="stylesheet">
<link href="../css/formStyle.css" rel="stylesheet">
</head>
<body>

	<h1>Bookstore Form</h1>

	<form:form name="saveBookstore" method="post" action="save"
		modelAttribute="bookstore">
		<form:hidden path="id"/>
		<table>
			<tr>
				<td>Name:</td>
				<td><form:input path="name"/></td>
			</tr>

			<tr>
				<td>Address:</td>
				<td><form:input path="address" /></td>
			</tr>

			<tr>
				<td>Tel</td>
				<td><form:input path="tel" /></td>
			</tr>
			
			
			<tr>
				<td><input type="submit" value="Save Bookstore"></td>
			</tr>

		</table>
	</form:form>

</body>
</html>