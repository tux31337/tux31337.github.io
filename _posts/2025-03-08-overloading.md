# Java 메서드 오버로딩과 메서드 시그니처

## 1. 메서드 오버로딩 (Method Overloading)

자바에서 메서드 오버로딩은 **같은 이름의 메서드를 여러 번 정의**할 수 있는 기능입니다. 오버로딩된 메서드는 메서드 이름은 동일하지만, **매개변수의 타입, 개수, 순서**가 다를 때 사용됩니다.

### 특징

- **메서드 이름은 동일**: 오버로딩된 메서드는 모두 같은 이름을 가집니다.
- **매개변수의 차이**: 매개변수의 **개수**, **타입**, 또는 **순서**가 다르면 같은 이름을 사용해도 됩니다.
- **반환 타입은 시그니처에 포함되지 않음**: 반환 타입만 다르면 오버로딩이 되지 않습니다.

### 예시

```java
class Calculator {

    // 두 개의 정수를 더하는 메서드
    public int add(int a, int b) {
        return a + b;
    }

    // 세 개의 정수를 더하는 메서드
    public int add(int a, int b, int c) {
        return a + b + c;
    }

    // 두 개의 실수를 더하는 메서드
    public double add(double a, double b) {
        return a + b;
    }
}

public class Main {
    public static void main(String[] args) {
        Calculator calc = new Calculator();

        System.out.println(calc.add(1, 2));         // 3
        System.out.println(calc.add(1, 2, 3));      // 6
        System.out.println(calc.add(1.5, 2.5));     // 4.0
    }
}
```

### 오버로딩 규칙

- **매개변수 개수**가 다를 때:
  - 매개변수의 개수가 다르면 같은 이름을 사용할 수 있습니다.
- **매개변수 타입**이 다를 때:
  - 매개변수의 타입이 다르면 같은 이름을 사용할 수 있습니다.
- **매개변수 순서**가 다를 때:
  - 매개변수의 순서가 다르면 같은 이름을 사용할 수 있습니다.

```java
public void printDetails(String name, int age) {
    // ...
}

public void printDetails(int age, String name) {
    // ...
}
```

### 오버로딩을 사용할 때 유의사항

- 반환 타입만 다른 메서드는 오버로딩으로 인식되지 않습니다.

  - **잘못된 예시**:

    ```java
    public int add(int a, int b) {
        return a + b;
    }

    public double add(int a, int b) {  // 반환 타입만 다른 경우
        return a + b;
    }
    ```

---

## 2. 메서드 시그니처 (Method Signature)

메서드 시그니처는 **메서드를 고유하게 식별**하는 데 사용되는 메서드의 정보를 말합니다. 자바에서 메서드 시그니처는 **메서드 이름**과 **매개변수 목록**으로 구성됩니다. 반환 타입은 메서드 시그니처의 일부가 아닙니다.

### 메서드 시그니처 구성 요소

1. **메서드 이름**: 메서드의 이름은 고유해야 합니다.
2. **매개변수 목록**: 매개변수의 **타입**과 **순서**가 시그니처의 일부로 포함됩니다. 매개변수의 **이름은 포함되지 않음**.

### 예시

```java
public int add(int a, int b) {  // 시그니처: add(int, int)
    return a + b;
}

public double add(double a, double b) {  // 시그니처: add(double, double)
    return a + b;
}

public String add(String a, String b) {  // 시그니처: add(String, String)
    return a + b;
}
```

### 메서드 시그니처와 오버로딩

- 메서드 오버로딩에서는 **메서드 시그니처**가 달라야 합니다. 즉, **같은 이름의 메서드라도 매개변수 목록**이 다르면 오버로딩이 가능합니다.
- **반환 타입은 시그니처에 포함되지 않으므로**, 반환 타입만 다른 메서드는 오버로딩이 되지 않습니다.

#### 예시: 시그니처가 다른 오버로딩 메서드

```java
class Calculator {

    // 시그니처: add(int, int)
    public int add(int a, int b) {
        return a + b;
    }

    // 시그니처: add(double, double)
    public double add(double a, double b) {
        return a + b;
    }

    // 시그니처: add(int, int, int)
    public int add(int a, int b, int c) {
        return a + b + c;
    }
}
```

### 시그니처의 중요성

- **오버로딩**에서는 시그니처가 달라야 메서드를 구별할 수 있습니다. 단지 반환 타입만 다르면 오버로딩이 가능합니다.
- **반환 타입**은 시그니처에 포함되지 않으므로, **반환 타입만 다른 메서드는 오버로딩으로 인정되지 않습니다**.

---

## 3. 잘못된 메서드 시그니처 예시

### 1. **반환 타입만 다른 경우**

자바에서는 **반환 타입만 다른 메서드는 오버로딩이 되지 않습니다**. 이는 메서드 시그니처가 동일한 것으로 취급되기 때문입니다. 메서드 시그니처는 메서드 이름과 매개변수 목록으로 구성되므로, 반환 타입은 시그니처의 일부가 아닙니다.

#### 잘못된 예시:

```java
public int add(int a, int b) {   // 시그니처: add(int, int)
    return a + b;
}

public double add(int a, int b) {  // 반환 타입만 다르면 오버로딩이 안됨
    return a + b;
}
```

### 2. **매개변수 이름만 다른 경우**

매개변수 이름만 달라져도 시그니처는 같다고 간주합니다. 즉, **매개변수 이름**은 시그니처에 포함되지 않으므로 이름만 다르게 해도 오버로딩이 되지 않습니다.

#### 잘못된 예시:

```java
public int add(int a, int b) {  // 시그니처: add(int, int)
    return a + b;
}

public int add(int x, int y) {  // 매개변수 이름만 다를 뿐, 시그니처는 같음
    return x + y;
}
```

### 3. **매개변수 타입이 동일한 경우**

매개변수 타입이 완전히 동일하면 시그니처는 같다고 간주됩니다. 매개변수 타입이나 순서가 변경되지 않으면 오버로딩이 이루어지지 않습니다.

#### 잘못된 예시:

```java
public int add(int a, int b) {  // 시그니처: add(int, int)
    return a + b;
}

public int add(int x, int y) {  // 매개변수 타입이 동일하고, 순서도 같아서 오버로딩 불가
    return x + y;
}
```

### 4. **가변 인수(varargs)와 다른 타입의 혼동**

가변 인수(varargs)를 사용하는 경우에는 **인수의 개수**가 다르기 때문에 오버로딩이 가능하지만, 다른 타입을 사용한 가변 인수를 잘못 정의하면 문제가 발생할 수 있습니다.

#### 잘못된 예시:

```java
public void printNumbers(int... numbers) {  // varargs 사용
    for (int number : numbers) {
        System.out.println(number);
    }
}

public void printNumbers(String... numbers) {  // 가변 인수의 타입만 다름
    for (String number : numbers) {
        System.out.println(number);
    }
}
```

### 결론

- **반환 타입만 다르게 오버로딩하는 것은 불가능**합니다.
- **매개변수 이름**은 시그니처에 포함되지 않으므로, 이름만 다르게 해도 오버로딩이 되지 않습니다.
- **매개변수 타입이나 순서**가 동일하면 시그니처는 동일하므로, 오버로딩이 되지 않습니다.

오버로딩을 사용할 때는 이러한 규칙을 기억하고, 메서드 시그니처가 정확히 다르게 작성되어야 합니다.
